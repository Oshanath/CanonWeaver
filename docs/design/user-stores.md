# CanonWeaver
CanonWeaver is a context-sensitive worldbuilding and storywriting tool to assist writers manage their content.

## Writing the story
- The UI mainly consists of a text area where users write the story which is the main part of the app.
- Each chapter of the story is a file. Each chapter consists of scenes. Scenes consist of blocks. A block is some text.
- Block is the only unit of processing within the whole story. That means each block is processed individually.
- After writing blocks can be saved individually. Scenes can be saved, which saves all the blocks within it. Chapter can be saved, which saves all the scenes within it, and in turn the blocks.
- After editing a block, an icon will show that it's unsaved.
- After saving it, an icon will signify that the knowledge in that block has not been gathered.
- The knowledge will be gathered by AI. After the knowledge has been gathered, that block is complete.
- Gathering knowledge creates necessary nodes and connections in the graph database, and updates all references with links to their bios. It also creates bios for new references and updates existing references with new information.
- Any and all actions taken by AI will be confirmed by the user. This will be non-configurable. The writer should always be in control of the knowledge.
- When gathering knowledge, the AI will complain if the new knowledge contradicts something in the knowledge base.

## Knowledge base
- For each single event that is happening in the story a new node will be made, and a new entry will be made in the corresponding bios with a link to the block that added it and the new event node. 
- If more than one entity participates in that event, and it changes the dynamics of their relationship, that will be recorded in the graph connection.

## Bios
- All entities (Characters, Locations) will have a dedicated bio page that will be created in the first mention, and updated as the story progresses.
- Each entry in bio pages will be linked to its origin.
- Exception will be manually added entries.
- Bio entries can be manually added.

## Search in story and bios
- Can search any term within the story chapters and the bios. Will return results in the vscode search style.
- Has filters (Case sensitivity, regex, chapter, bios only)

## Knowledge querying
- AI assisted search feature where users can ask questions in natural language from the knowledge base.