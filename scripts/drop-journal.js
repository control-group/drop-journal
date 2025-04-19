Hooks.once("ready", () => {
    if (!game.user.isGM) return;
  
    const canvasElement = document.getElementById("board");
    if (!canvasElement) return;
  
    canvasElement.addEventListener("dragover", ev => {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "copy";
    });
  
    canvasElement.addEventListener("drop", async ev => {
      ev.preventDefault();
  
      const file = ev.dataTransfer.files[0];
      if (!file) return;
  
      if (!file.type.startsWith("image/")) {
        ui.notifications.warn("Only image files are supported.");
        return;
      }
  
      try {
        // Upload the image to Foundry's user data
        const upload = await FilePicker.upload("data", "uploads/", file, {}, { notify: true });
        const imageUrl = upload.path;
  
        // Create a journal entry with the image
        const journal = await JournalEntry.create({
          name: file.name,
          pages: [{
            name: "Image",
            type: "image",
            image: imageUrl,
            text: "",
            title: file.name
          }]
        });
  
        // Open the journal entry
        await journal.sheet.render(true);
  
      } catch (err) {
        console.error(err);
        ui.notifications.error("Failed to create journal entry from dropped image.");
      }
    });
  });
  