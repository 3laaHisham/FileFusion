package net.atos.WorkspaceService.enums;

public enum FileType {

    Pdf(new String[]{"pdf"}),
    Image(new String[]{"jpeg", "jpg", "png", "gif", "bmp", "webp", "tiff", "svg"}),
    Word(new String[]{"doc", "docx"}),
    Excel(new String[]{"xls", "xlsx"}),
    Presentation(new String[]{"ppt", "pptx", "ppsx", "key"}),
    Text(new String[]{"txt", "csv", "html", "css", "js", "json", "xml"}),
    Video(new String[]{"mp4", "wmv", "flv", "webm", "avi", "mpeg"}),
    Audio(new String[]{"mp3", "wav"}),
    Archive(new String[]{"zip", "rar", "tar", "gz"}),

    Folder(new String[]{"/"}),  // Assuming a folder might be represented by a specific string or character

    Unknown(new String[]{"-"});

    private final String[] extensions;

    FileType(String[] extensions) {
        this.extensions = extensions;
    }

    public String[] getValues() {
        return extensions;
    }

    /**
     * Get the correct FileType based on file extension.
     *
     * @param extension The file extension to match (without the dot).
     * @return The corresponding FileType or FileType.Unknown if no match is found.
     */
    public static FileType fromExtension(String extension) {
        if (extension == null || extension.isEmpty()) {
            return FileType.Unknown;
        }

        for (FileType fileType : FileType.values()) {
            for (String ext : fileType.getValues()) {
                if (ext.equalsIgnoreCase(extension)) {
                    return fileType;
                }
            }
        }

        return FileType.Unknown;
    }

    public static FileType fromValue(String value) {
        for (FileType fileType : FileType.values()) {
            if (fileType.name().equalsIgnoreCase(value)) {
                return fileType;
            }
        }
        return FileType.Unknown;
    }
}
