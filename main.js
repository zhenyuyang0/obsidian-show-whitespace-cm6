/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
module.exports = __toCommonJS(main_exports);

// src/whitespace-Plugin.ts
var import_obsidian2 = require("obsidian");
var import_view = require("@codemirror/view");

// src/whitespace-SettingsTab.ts
var import_obsidian = require("obsidian");
var ShowWhitespaceSettingsTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  async save() {
    await this.plugin.updateSettings(this.newSettings);
  }
  async display() {
    await this.plugin.loadSettings();
    this.reset();
  }
  async reset() {
    this.newSettings = JSON.parse(JSON.stringify(this.plugin.settings));
    this.drawElements();
  }
  drawElements() {
    const id = this.plugin.manifest.id;
    const name = this.plugin.manifest.name;
    this.containerEl.empty();
    this.containerEl.addClass(id);
    new import_obsidian.Setting(this.containerEl).setHeading().setName(name);
    new import_obsidian.Setting(this.containerEl).setName("Save settings").setClass(id + "-save-reset").addButton(
      (button) => button.setIcon("reset").setTooltip(
        "Reset to previously saved (or generated) values"
      ).onClick(() => {
        this.reset();
        console.log("(SW-CM6) Configuration reset");
      })
    ).addButton((button) => {
      button.setIcon("save").setTooltip("Save current values").onClick(async () => {
        await this.save();
      });
      this.saveButton = button.buttonEl;
    });
    new import_obsidian.Setting(this.containerEl).setName("Suppress plugin styles").setDesc(
      "Enable to remove plugin styles. You will need to define your own snippet to customize the appearance of whitespace"
    ).addToggle(
      (toggle) => toggle.setValue(this.newSettings.disablePluginStyles).onChange(async (value) => {
        const redraw = value != this.newSettings.disablePluginStyles;
        this.newSettings.disablePluginStyles = value;
        if (redraw) {
          this.drawElements();
        }
      })
    );
    new import_obsidian.Setting(this.containerEl).setName("Always show blockquote markers").setDesc("Show the leading > for blockquotes in Live Preview").addToggle(
      (toggle) => toggle.setValue(this.newSettings.showBlockquoteMarkers).onChange(async (value) => {
        const redraw = value != this.newSettings.showBlockquoteMarkers;
        this.newSettings.showBlockquoteMarkers = value;
        if (redraw) {
          this.drawElements();
        }
      })
    );
    new import_obsidian.Setting(this.containerEl).setName("Show all whitespace characters in code blocks").setDesc(
      "Add a marker for all whitespace characters in code blocks (included in Show all whitespace)"
    ).addToggle(
      (toggle) => toggle.setValue(this.newSettings.showCodeblockWhitespace).onChange(async (value) => {
        value = value || this.newSettings.showAllWhitespace;
        const redraw = value != this.newSettings.showCodeblockWhitespace;
        this.newSettings.showCodeblockWhitespace = value;
        if (redraw) {
          this.drawElements();
        }
      })
    );
    new import_obsidian.Setting(this.containerEl).setName("Show all whitespace characters").setDesc(
      "Add a marker for all whitespace characters, even those between words"
    ).addToggle(
      (toggle) => toggle.setValue(this.newSettings.showAllWhitespace).onChange(async (value) => {
        const redraw = value != this.newSettings.showAllWhitespace;
        this.newSettings.showAllWhitespace = value;
        if (redraw) {
          this.drawElements();
        }
      })
    );
    new import_obsidian.Setting(this.containerEl).setName("Outline list markers").setDesc(
      "Add a style to space reserved by list markers (e.g. ' -' or ' 1.')"
    ).addToggle(
      (toggle) => toggle.setValue(this.newSettings.outlineListMarkers).onChange(async (value) => {
        const redraw = value != this.newSettings.outlineListMarkers;
        this.newSettings.outlineListMarkers = value;
        if (redraw) {
          this.drawElements();
        }
      })
    );
  }
  /** Save on exit */
  hide() {
    this.save();
  }
};

// src/whitespace-Plugin.ts
var DEFAULT_SETTINGS = {
  version: {
    major: 0,
    minor: 0,
    patch: 0
  },
  disablePluginStyles: false,
  showBlockquoteMarkers: false,
  showCodeblockWhitespace: false,
  showAllWhitespace: false,
  outlineListMarkers: false
};
var ShowWhitespacePlugin = class extends import_obsidian2.Plugin {
  constructor() {
    super(...arguments);
    /** CodeMirror 6 extensions. Tracked via array to allow for dynamic updates. */
    this.cmExtension = [];
    this.classList = [];
    this.onExternalSettingsChange = (0, import_obsidian2.debounce)(
      async () => {
        this.settings = Object.assign(
          {},
          this.settings,
          await this.loadData()
        );
        this.removeClasses();
        this.initClasses();
        console.debug("(SW-CM6) external settings changed");
      },
      2e3,
      true
    );
  }
  async onload() {
    console.info(
      "loading Show Whitespace (SW-CM6) v" + this.manifest.version
    );
    await this.loadSettings();
    this.addSettingTab(new ShowWhitespaceSettingsTab(this.app, this));
    document.body.classList.add(this.manifest.id);
    this.initClasses();
    this.cmExtension.push((0, import_view.highlightWhitespace)());
    this.cmExtension.push((0, import_view.highlightTrailingWhitespace)());
    this.registerEditorExtension(this.cmExtension);
  }
  initClasses() {
    this.classList = [];
    if (this.settings.disablePluginStyles) {
      this.classList.push("swcm6-nix-plugin-styles");
    }
    if (this.settings.showBlockquoteMarkers) {
      this.classList.push("swcm6-show-blockquote-markers");
    }
    if (this.settings.showCodeblockWhitespace) {
      this.classList.push("swcm6-show-codeblock-whitespace");
    }
    if (this.settings.showAllWhitespace) {
      this.classList.push("swcm6-show-all-whitespace");
    }
    if (this.settings.outlineListMarkers) {
      this.classList.push("swcm6-outline-list-markers");
    }
    document.body.classList.add(...this.classList);
  }
  removeClasses() {
    document.body.classList.remove(...this.classList);
  }
  onunload() {
    console.log("(SW-CM6) unloading Show Whitespace");
    document.body.classList.add(this.manifest.id);
    this.removeClasses();
  }
  async handleConfigFileChange() {
    await super.handleConfigFileChange();
    this.onExternalSettingsChange();
  }
  async loadSettings() {
    if (!this.settings) {
      const options = await this.loadData();
      this.settings = Object.assign({}, DEFAULT_SETTINGS, options);
      const version = toVersion(this.manifest.version);
      if (compareVersion(version, this.settings.version) != 0) {
        this.settings.version = version;
        await this.saveSettings();
      }
    }
  }
  async updateSettings(newSettings) {
    this.settings = Object.assign({}, this.settings, newSettings);
    await this.saveSettings();
    this.removeClasses();
    this.initClasses();
    console.log("(SW-CM6) settings and classes updated");
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
function compareVersion(v1, v2) {
  if (v1.major === v2.major) {
    if (v1.minor === v2.minor) {
      return v1.patch - v2.patch;
    }
    return v1.minor - v2.minor;
  }
  return v1.major - v2.major;
}
function toVersion(version) {
  const v = version.split(".");
  return {
    major: Number(v[0]),
    minor: Number(v[1]),
    patch: Number(v[2])
  };
}

// src/main.ts
var main_default = ShowWhitespacePlugin;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiLCAic3JjL3doaXRlc3BhY2UtUGx1Z2luLnRzIiwgInNyYy93aGl0ZXNwYWNlLVNldHRpbmdzVGFiLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBTaG93V2hpdGVzcGFjZVBsdWdpbiB9IGZyb20gXCIuL3doaXRlc3BhY2UtUGx1Z2luXCI7XG5cbmV4cG9ydCBkZWZhdWx0IFNob3dXaGl0ZXNwYWNlUGx1Z2luO1xuIiwgImltcG9ydCB7IFBsdWdpbiwgZGVib3VuY2UgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7XG4gICAgaGlnaGxpZ2h0VHJhaWxpbmdXaGl0ZXNwYWNlLFxuICAgIGhpZ2hsaWdodFdoaXRlc3BhY2UsXG59IGZyb20gXCJAY29kZW1pcnJvci92aWV3XCI7XG5pbXBvcnQgeyBFeHRlbnNpb24gfSBmcm9tIFwiQGNvZGVtaXJyb3Ivc3RhdGVcIjtcbmltcG9ydCB7IFNXU2V0dGluZ3MsIFNXVmVyc2lvbiB9IGZyb20gXCIuL0B0eXBlcy9zZXR0aW5nc1wiO1xuaW1wb3J0IHsgU2hvd1doaXRlc3BhY2VTZXR0aW5nc1RhYiB9IGZyb20gXCIuL3doaXRlc3BhY2UtU2V0dGluZ3NUYWJcIjtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IFNXU2V0dGluZ3MgPSB7XG4gICAgdmVyc2lvbjoge1xuICAgICAgICBtYWpvcjogMCxcbiAgICAgICAgbWlub3I6IDAsXG4gICAgICAgIHBhdGNoOiAwLFxuICAgIH0sXG4gICAgZGlzYWJsZVBsdWdpblN0eWxlczogZmFsc2UsXG4gICAgc2hvd0Jsb2NrcXVvdGVNYXJrZXJzOiBmYWxzZSxcbiAgICBzaG93Q29kZWJsb2NrV2hpdGVzcGFjZTogZmFsc2UsXG4gICAgc2hvd0FsbFdoaXRlc3BhY2U6IGZhbHNlLFxuICAgIG91dGxpbmVMaXN0TWFya2VyczogZmFsc2UsXG59O1xuXG5leHBvcnQgY2xhc3MgU2hvd1doaXRlc3BhY2VQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICAgIC8qKiBDb2RlTWlycm9yIDYgZXh0ZW5zaW9ucy4gVHJhY2tlZCB2aWEgYXJyYXkgdG8gYWxsb3cgZm9yIGR5bmFtaWMgdXBkYXRlcy4gKi9cbiAgICBwcml2YXRlIGNtRXh0ZW5zaW9uOiBFeHRlbnNpb25bXSA9IFtdO1xuICAgIHNldHRpbmdzOiBTV1NldHRpbmdzO1xuICAgIGNsYXNzTGlzdDogc3RyaW5nW10gPSBbXTtcblxuICAgIGFzeW5jIG9ubG9hZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc29sZS5pbmZvKFxuICAgICAgICAgICAgXCJsb2FkaW5nIFNob3cgV2hpdGVzcGFjZSAoU1ctQ002KSB2XCIgKyB0aGlzLm1hbmlmZXN0LnZlcnNpb24sXG4gICAgICAgICk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICAgICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBTaG93V2hpdGVzcGFjZVNldHRpbmdzVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKHRoaXMubWFuaWZlc3QuaWQpO1xuICAgICAgICB0aGlzLmluaXRDbGFzc2VzKCk7XG5cbiAgICAgICAgdGhpcy5jbUV4dGVuc2lvbi5wdXNoKGhpZ2hsaWdodFdoaXRlc3BhY2UoKSk7XG4gICAgICAgIHRoaXMuY21FeHRlbnNpb24ucHVzaChoaWdobGlnaHRUcmFpbGluZ1doaXRlc3BhY2UoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFZGl0b3JFeHRlbnNpb24odGhpcy5jbUV4dGVuc2lvbik7XG4gICAgfVxuXG4gICAgaW5pdENsYXNzZXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2xhc3NMaXN0ID0gW107XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmRpc2FibGVQbHVnaW5TdHlsZXMpIHtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnB1c2goXCJzd2NtNi1uaXgtcGx1Z2luLXN0eWxlc1wiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93QmxvY2txdW90ZU1hcmtlcnMpIHtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnB1c2goXCJzd2NtNi1zaG93LWJsb2NrcXVvdGUtbWFya2Vyc1wiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93Q29kZWJsb2NrV2hpdGVzcGFjZSkge1xuICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucHVzaChcInN3Y202LXNob3ctY29kZWJsb2NrLXdoaXRlc3BhY2VcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3Muc2hvd0FsbFdoaXRlc3BhY2UpIHtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnB1c2goXCJzd2NtNi1zaG93LWFsbC13aGl0ZXNwYWNlXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLm91dGxpbmVMaXN0TWFya2Vycykge1xuICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucHVzaChcInN3Y202LW91dGxpbmUtbGlzdC1tYXJrZXJzXCIpO1xuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCguLi50aGlzLmNsYXNzTGlzdCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2xhc3NlcygpOiB2b2lkIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKC4uLnRoaXMuY2xhc3NMaXN0KTtcbiAgICB9XG5cbiAgICBvbnVubG9hZCgpOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5sb2coXCIoU1ctQ002KSB1bmxvYWRpbmcgU2hvdyBXaGl0ZXNwYWNlXCIpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQodGhpcy5tYW5pZmVzdC5pZCk7XG4gICAgICAgIHRoaXMucmVtb3ZlQ2xhc3NlcygpO1xuICAgIH1cblxuICAgIGFzeW5jIGhhbmRsZUNvbmZpZ0ZpbGVDaGFuZ2UoKSB7XG4gICAgICAgIGF3YWl0IHN1cGVyLmhhbmRsZUNvbmZpZ0ZpbGVDaGFuZ2UoKTtcbiAgICAgICAgdGhpcy5vbkV4dGVybmFsU2V0dGluZ3NDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25FeHRlcm5hbFNldHRpbmdzQ2hhbmdlID0gZGVib3VuY2UoXG4gICAgICAgIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MsXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5sb2FkRGF0YSgpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2xhc3NlcygpO1xuICAgICAgICAgICAgdGhpcy5pbml0Q2xhc3NlcygpO1xuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhcIihTVy1DTTYpIGV4dGVybmFsIHNldHRpbmdzIGNoYW5nZWRcIik7XG4gICAgICAgIH0sXG4gICAgICAgIDIwMDAsXG4gICAgICAgIHRydWUsXG4gICAgKTtcblxuICAgIGFzeW5jIGxvYWRTZXR0aW5ncygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKCF0aGlzLnNldHRpbmdzKSB7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0gYXdhaXQgdGhpcy5sb2FkRGF0YSgpO1xuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBzZXR0aW5ncyB2ZXJzaW9uLCBhZGFwdCBpZiBuZWNlc3NhcnlcbiAgICAgICAgICAgIGNvbnN0IHZlcnNpb24gPSB0b1ZlcnNpb24odGhpcy5tYW5pZmVzdC52ZXJzaW9uKTtcbiAgICAgICAgICAgIGlmIChjb21wYXJlVmVyc2lvbih2ZXJzaW9uLCB0aGlzLnNldHRpbmdzLnZlcnNpb24pICE9IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGVTZXR0aW5ncyhuZXdTZXR0aW5nczogU1dTZXR0aW5ncyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zZXR0aW5ncywgbmV3U2V0dGluZ3MpO1xuICAgICAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB0aGlzLnJlbW92ZUNsYXNzZXMoKTtcbiAgICAgICAgdGhpcy5pbml0Q2xhc3NlcygpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIihTVy1DTTYpIHNldHRpbmdzIGFuZCBjbGFzc2VzIHVwZGF0ZWRcIik7XG4gICAgfVxuXG4gICAgYXN5bmMgc2F2ZVNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY29tcGFyZVZlcnNpb24odjE6IFNXVmVyc2lvbiwgdjI6IFNXVmVyc2lvbik6IG51bWJlciB7XG4gICAgaWYgKHYxLm1ham9yID09PSB2Mi5tYWpvcikge1xuICAgICAgICBpZiAodjEubWlub3IgPT09IHYyLm1pbm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gdjEucGF0Y2ggLSB2Mi5wYXRjaDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdjEubWlub3IgLSB2Mi5taW5vcjtcbiAgICB9XG4gICAgcmV0dXJuIHYxLm1ham9yIC0gdjIubWFqb3I7XG59XG5mdW5jdGlvbiB0b1ZlcnNpb24odmVyc2lvbjogc3RyaW5nKTogU1dWZXJzaW9uIHtcbiAgICBjb25zdCB2ID0gdmVyc2lvbi5zcGxpdChcIi5cIik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbWFqb3I6IE51bWJlcih2WzBdKSxcbiAgICAgICAgbWlub3I6IE51bWJlcih2WzFdKSxcbiAgICAgICAgcGF0Y2g6IE51bWJlcih2WzJdKSxcbiAgICB9O1xufVxuIiwgImltcG9ydCB7IEFwcCwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IFNob3dXaGl0ZXNwYWNlUGx1Z2luIGZyb20gXCIuL21haW5cIjtcbmltcG9ydCB7IFNXU2V0dGluZ3MgfSBmcm9tIFwiLi9AdHlwZXMvc2V0dGluZ3NcIjtcblxuZXhwb3J0IGNsYXNzIFNob3dXaGl0ZXNwYWNlU2V0dGluZ3NUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgICBwbHVnaW46IFNob3dXaGl0ZXNwYWNlUGx1Z2luO1xuICAgIG5ld1NldHRpbmdzOiBTV1NldHRpbmdzO1xuICAgIHNhdmVCdXR0b246IEhUTUxFbGVtZW50O1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogU2hvd1doaXRlc3BhY2VQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICB9XG5cbiAgICBhc3luYyBzYXZlKCkge1xuICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi51cGRhdGVTZXR0aW5ncyh0aGlzLm5ld1NldHRpbmdzKTtcbiAgICB9XG5cbiAgICBhc3luYyBkaXNwbGF5KCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5sb2FkU2V0dGluZ3MoKTtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cblxuICAgIGFzeW5jIHJlc2V0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLm5ld1NldHRpbmdzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLnBsdWdpbi5zZXR0aW5ncykpO1xuICAgICAgICB0aGlzLmRyYXdFbGVtZW50cygpO1xuICAgIH1cblxuICAgIGRyYXdFbGVtZW50cygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLnBsdWdpbi5tYW5pZmVzdC5pZDtcbiAgICAgICAgY29uc3QgbmFtZSA9IHRoaXMucGx1Z2luLm1hbmlmZXN0Lm5hbWU7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5lbXB0eSgpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmFkZENsYXNzKGlkKTtcbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbCkuc2V0SGVhZGluZygpLnNldE5hbWUobmFtZSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiU2F2ZSBzZXR0aW5nc1wiKVxuICAgICAgICAgICAgLnNldENsYXNzKGlkICsgXCItc2F2ZS1yZXNldFwiKVxuICAgICAgICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uKSA9PlxuICAgICAgICAgICAgICAgIGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAuc2V0SWNvbihcInJlc2V0XCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJSZXNldCB0byBwcmV2aW91c2x5IHNhdmVkIChvciBnZW5lcmF0ZWQpIHZhbHVlc1wiLFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiKFNXLUNNNikgQ29uZmlndXJhdGlvbiByZXNldFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgICAgICAgICBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJzYXZlXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKFwiU2F2ZSBjdXJyZW50IHZhbHVlc1wiKVxuICAgICAgICAgICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlQnV0dG9uID0gYnV0dG9uLmJ1dHRvbkVsO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiU3VwcHJlc3MgcGx1Z2luIHN0eWxlc1wiKVxuICAgICAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgICAgICAgXCJFbmFibGUgdG8gcmVtb3ZlIHBsdWdpbiBzdHlsZXMuIFlvdSB3aWxsIG5lZWQgdG8gZGVmaW5lIHlvdXIgb3duIHNuaXBwZXQgdG8gY3VzdG9taXplIHRoZSBhcHBlYXJhbmNlIG9mIHdoaXRlc3BhY2VcIixcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMubmV3U2V0dGluZ3MuZGlzYWJsZVBsdWdpblN0eWxlcylcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVkcmF3ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSAhPSB0aGlzLm5ld1NldHRpbmdzLmRpc2FibGVQbHVnaW5TdHlsZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld1NldHRpbmdzLmRpc2FibGVQbHVnaW5TdHlsZXMgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWRyYXcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdFbGVtZW50cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiQWx3YXlzIHNob3cgYmxvY2txdW90ZSBtYXJrZXJzXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcIlNob3cgdGhlIGxlYWRpbmcgPiBmb3IgYmxvY2txdW90ZXMgaW4gTGl2ZSBQcmV2aWV3XCIpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLm5ld1NldHRpbmdzLnNob3dCbG9ja3F1b3RlTWFya2VycylcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVkcmF3ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSAhPSB0aGlzLm5ld1NldHRpbmdzLnNob3dCbG9ja3F1b3RlTWFya2VycztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV3U2V0dGluZ3Muc2hvd0Jsb2NrcXVvdGVNYXJrZXJzID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVkcmF3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3RWxlbWVudHMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIlNob3cgYWxsIHdoaXRlc3BhY2UgY2hhcmFjdGVycyBpbiBjb2RlIGJsb2Nrc1wiKVxuICAgICAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgICAgICAgXCJBZGQgYSBtYXJrZXIgZm9yIGFsbCB3aGl0ZXNwYWNlIGNoYXJhY3RlcnMgaW4gY29kZSBibG9ja3MgKGluY2x1ZGVkIGluIFNob3cgYWxsIHdoaXRlc3BhY2UpXCIsXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLm5ld1NldHRpbmdzLnNob3dDb2RlYmxvY2tXaGl0ZXNwYWNlKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIHx8IHRoaXMubmV3U2V0dGluZ3Muc2hvd0FsbFdoaXRlc3BhY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWRyYXcgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICE9IHRoaXMubmV3U2V0dGluZ3Muc2hvd0NvZGVibG9ja1doaXRlc3BhY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld1NldHRpbmdzLnNob3dDb2RlYmxvY2tXaGl0ZXNwYWNlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVkcmF3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3RWxlbWVudHMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIlNob3cgYWxsIHdoaXRlc3BhY2UgY2hhcmFjdGVyc1wiKVxuICAgICAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgICAgICAgXCJBZGQgYSBtYXJrZXIgZm9yIGFsbCB3aGl0ZXNwYWNlIGNoYXJhY3RlcnMsIGV2ZW4gdGhvc2UgYmV0d2VlbiB3b3Jkc1wiLFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5uZXdTZXR0aW5ncy5zaG93QWxsV2hpdGVzcGFjZSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVkcmF3ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSAhPSB0aGlzLm5ld1NldHRpbmdzLnNob3dBbGxXaGl0ZXNwYWNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdTZXR0aW5ncy5zaG93QWxsV2hpdGVzcGFjZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlZHJhdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd0VsZW1lbnRzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJPdXRsaW5lIGxpc3QgbWFya2Vyc1wiKVxuICAgICAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgICAgICAgXCJBZGQgYSBzdHlsZSB0byBzcGFjZSByZXNlcnZlZCBieSBsaXN0IG1hcmtlcnMgKGUuZy4gJyAtJyBvciAnIDEuJylcIixcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMubmV3U2V0dGluZ3Mub3V0bGluZUxpc3RNYXJrZXJzKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWRyYXcgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICE9IHRoaXMubmV3U2V0dGluZ3Mub3V0bGluZUxpc3RNYXJrZXJzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdTZXR0aW5ncy5vdXRsaW5lTGlzdE1hcmtlcnMgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWRyYXcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdFbGVtZW50cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqIFNhdmUgb24gZXhpdCAqL1xuICAgIGhpZGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBQ0FBLElBQUFBLG1CQUFpQztBQUNqQyxrQkFHTzs7O0FDSlAsc0JBQStDO0FBSXhDLElBQU0sNEJBQU4sY0FBd0MsaUNBQWlCO0FBQUEsRUFLNUQsWUFBWSxLQUFVLFFBQThCO0FBQ2hELFVBQU0sS0FBSyxNQUFNO0FBQ2pCLFNBQUssU0FBUztBQUFBLEVBQ2xCO0FBQUEsRUFFQSxNQUFN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
