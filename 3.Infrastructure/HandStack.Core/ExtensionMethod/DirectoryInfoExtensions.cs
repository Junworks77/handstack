using System.IO.Compression;
using System.Text;

namespace HandStack.Core.ExtensionMethod
{
    public static class DirectoryInfoExtensions
    {
        /// <code>
        /// var files = @this.GetFiles("*.txt", "*.xml");
        /// </code>
        public static FileInfo[] GetFiles(this DirectoryInfo @this, params string[] patterns)
        {
            var files = new List<FileInfo>();
            foreach (var pattern in patterns)
            {
                files.AddRange(@this.GetFiles(pattern));
            }
            return files.ToArray();
        }

        /// <code>
        /// var @this = new DirectoryInfo(@"c:\");
        /// var file = @this.FindFileRecursive("win.ini");
        /// </code>
        public static FileInfo? FindFileRecursive(this DirectoryInfo @this, string searchPattern)
        {
            FileInfo? result = null;
            var files = @this.GetFiles(searchPattern);
            if (files.Length > 0) return files[0];

            foreach (var subDirectory in @this.GetDirectories())
            {
                var foundFile = subDirectory.FindFileRecursive(searchPattern);
                if (foundFile != null)
                {
                    result = foundFile;
                    break;
                }
            }
            return result;
        }

        /// <code>
        /// var @this = new DirectoryInfo(@"c:\");
        /// var file = @this.FindFileRecursive(f => f.Extension == ".ini");
        /// </code>
        public static FileInfo? FindFileRecursive(this DirectoryInfo @this, Func<FileInfo, bool> predicate)
        {
            FileInfo? result = null;
            foreach (var file in @this.GetFiles())
            {
                if (predicate(file)) return file;
            }

            foreach (var subDirectory in @this.GetDirectories())
            {
                var foundFile = subDirectory.FindFileRecursive(predicate);
                if (foundFile != null)
                {
                    result = foundFile;
                    break;
                }
            }
            return result;
        }

        /// <code>
        /// var @this = new DirectoryInfo(@"c:\");
        /// var files = @this.FindFilesRecursive("*.ini");
        /// </code>
        public static FileInfo[] FindFilesRecursive(this DirectoryInfo @this, string pattern)
        {
            var foundFiles = new List<FileInfo>();
            FindFilesRecursive(@this, pattern, foundFiles);
            return foundFiles.ToArray();
        }

        private static void FindFilesRecursive(DirectoryInfo @this, string pattern, List<FileInfo> foundFiles)
        {
            foundFiles.AddRange(@this.GetFiles(pattern));
            @this.GetDirectories().ForEach(d => FindFilesRecursive(d, pattern, foundFiles));
        }

        /// <code>
        /// var @this = new DirectoryInfo(@"c:\");
        /// var files = @this.FindFilesRecursive(f => f.Extension == ".ini");
        /// </code>
        public static FileInfo[] FindFilesRecursive(this DirectoryInfo @this, Func<FileInfo, bool> predicate)
        {
            var foundFiles = new List<FileInfo>();
            FindFilesRecursive(@this, predicate, foundFiles);
            return foundFiles.ToArray();
        }

        private static void FindFilesRecursive(DirectoryInfo @this, Func<FileInfo, bool> predicate, List<FileInfo> foundFiles)
        {
            foundFiles.AddRange(@this.GetFiles().Where(predicate));
            @this.GetDirectories().ForEach(d => FindFilesRecursive(d, predicate, foundFiles));
        }

        public static void CopyTo(this DirectoryInfo @this, string destination, bool recursive)
        {
            if (@this == null)
            {
                throw new ArgumentNullException("source");
            }
            if (destination == null)
            {
                throw new ArgumentNullException("destination");
            }

            DirectoryInfo target = new DirectoryInfo(destination);
            if (@this.Exists == false)
            {
                throw new DirectoryNotFoundException("source 디렉토리 확인 필요: " + @this.FullName);
            }
            if (target.Exists == false)
            {
                target.Create();
            }

            foreach (var file in @this.GetFiles())
            {
                file.CopyTo(Path.Combine(target.FullName, file.Name), true);
            }

            if (recursive == true)
            {
                foreach (var subDirectory in @this.GetDirectories())
                {
                    CopyTo(subDirectory, Path.Combine(target.FullName, subDirectory.Name), recursive);
                }
            }
        }

        public static void CreateZipFile(this DirectoryInfo @this, string destinationArchiveFileName)
        {
            ZipFile.CreateFromDirectory(@this.FullName, destinationArchiveFileName);
        }

        public static void CreateZipFile(this DirectoryInfo @this, string destinationArchiveFileName, CompressionLevel compressionLevel, bool includeBaseDirectory)
        {
            ZipFile.CreateFromDirectory(@this.FullName, destinationArchiveFileName, compressionLevel, includeBaseDirectory);
        }

        public static void CreateZipFile(this DirectoryInfo @this, string destinationArchiveFileName, CompressionLevel compressionLevel, bool includeBaseDirectory, Encoding entryNameEncoding)
        {
            ZipFile.CreateFromDirectory(@this.FullName, destinationArchiveFileName, compressionLevel, includeBaseDirectory, entryNameEncoding);
        }

        public static void CreateZipFile(this DirectoryInfo @this, FileInfo destinationArchiveFile)
        {
            ZipFile.CreateFromDirectory(@this.FullName, destinationArchiveFile.FullName);
        }

        public static void CreateZipFile(this DirectoryInfo @this, FileInfo destinationArchiveFile, CompressionLevel compressionLevel, bool includeBaseDirectory)
        {
            ZipFile.CreateFromDirectory(@this.FullName, destinationArchiveFile.FullName, compressionLevel, includeBaseDirectory);
        }

        public static void CreateZipFile(this DirectoryInfo @this, FileInfo destinationArchiveFile, CompressionLevel compressionLevel, bool includeBaseDirectory, Encoding entryNameEncoding)
        {
            ZipFile.CreateFromDirectory(@this.FullName, destinationArchiveFile.FullName, compressionLevel, includeBaseDirectory, entryNameEncoding);
        }
    }
}
