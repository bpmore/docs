module.exports = {
    plugins: [
        require('postcss-import'),
        require('tailwindcss'),
        require('postcss-nested'),
        require('autoprefixer'),
        require('postcss-preset-env')({ stage: 0 }),
    ],
};
