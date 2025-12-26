CREATE TABLE IF NOT EXISTS chapters (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    sort_order INT NOT NULL,
    UNIQUE KEY uq_chapters_sort_order (sort_order)
);

CREATE TABLE IF NOT EXISTS scenes (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    sort_order INT NOT NULL,
    chapter_id BIGINT NOT NULL,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);

CREATE TABLE IF NOT EXISTS blocks (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    scene_id BIGINT NOT NULL,
    FOREIGN KEY (scene_id) REFERENCES scenes(id)
);
