module.exports = {
    // Global options:
    // verbose: true,
    // Command options:
    build: {
        overwriteDest: true,
    },
    // run: {
    //     firefox: "nightly",
    // },
    "artifactsDir": "firefox_build",
    ignoreFiles: [
        ".gitignore",
        "CHANGELOG.md",
        "firefox_config.js",
        "chrome_config.js",
        "firefox_config.cjs",
        "chrome_config.cjs",
        "HOWTO.md",
        "firefox_build",
        "chrome_build",
        "README.md",
        "package.json",
        "package-lock.json",
        "LICENSE"
    ],
};
