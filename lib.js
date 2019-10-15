module.exports =  {
    /**
     * Converts a long string of bytes into a readable format e.g KB, MB, GB, TB, YB
     * 
     * @param {Int} num The number of bytes.
     */
    readableBytes : function readableBytes(bytes) {
        var i = Math.floor(Math.log(bytes) / Math.log(1024)),
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
    }

}