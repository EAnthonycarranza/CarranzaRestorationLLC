const webpack = require('webpack');

module.exports = function override(config, env) {
    // Provide jQuery for plugins that require it
    config.plugins.push(
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    );
    return config;
};
