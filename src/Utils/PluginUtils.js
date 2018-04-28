const Plugin = require('../lib/Plugin');

module.exports = pluginUtils;

function pluginUtils (cno, plugin) {
    if (plugin && plugin.name) {
        add(cno, plugin.key, plugin.req());
    }
}

function add (cno, key, plugin) {
    if (plugin) {
        cno[key] = plugin;
    }
}

pluginUtils.Plugin = Plugin;