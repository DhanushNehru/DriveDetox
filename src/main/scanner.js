const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

// Recursively get all files in a directory
async function getFilesRecursive(dir) {
    let results = [];
    try {
        const list = await fs.readdir(dir, { withFileTypes: true });
        for (const file of list) {
            const filePath = path.join(dir, file.name);
            if (file.isDirectory()) {
                // Skip hidden folders and system directories to avoid permission errors
                if (!file.name.startsWith('.') && file.name !== 'System Volume Information') {
                    const res = await getFilesRecursive(filePath);
                    results = results.concat(res);
                }
            } else {
                // Skip hidden files
                if (!file.name.startsWith('.')) {
                    results.push(filePath);
                }
            }
        }
    } catch (err) {
        console.warn(`Skipping restricted directory: ${dir}`);
    }
    return results;
}

// Generate SHA-256 hash of a file's contents
async function hashFile(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = require('fs').createReadStream(filePath);
        stream.on('error', err => reject(err));
        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
    });
}

// The core engine: Finds duplicates fast
async function findDuplicates(targetPath) {
    const files = await getFilesRecursive(targetPath);
    const sizeMap = new Map();

    // STEP 1: Group files by their exact byte size (Huge optimization)
    for (const file of files) {
        try {
            const stats = await fs.stat(file);
            if (!sizeMap.has(stats.size)) sizeMap.set(stats.size, []);
            sizeMap.get(stats.size).push({ path: file, size: stats.size });
        } catch (err) {
            // Ignore unreadable files
        }
    }

    const duplicates = [];
    
    // STEP 2: Only hash files that share the exact same size
    for (const [size, fileList] of sizeMap.entries()) {
        if (fileList.length > 1) { // Only investigate if multiple files have this size
            const hashMap = new Map();
            for (const fileObj of fileList) {
                try {
                    const hash = await hashFile(fileObj.path);
                    if (!hashMap.has(hash)) hashMap.set(hash, []);
                    hashMap.get(hash).push(fileObj.path);
                } catch (err) {}
            }
            
            // Collect any hashes that appear more than once
            for (const [hash, paths] of hashMap.entries()) {
                if (paths.length > 1) {
                    duplicates.push({ hash, size, files: paths });
                }
            }
        }
    }
    return duplicates;
}

module.exports = { findDuplicates };
