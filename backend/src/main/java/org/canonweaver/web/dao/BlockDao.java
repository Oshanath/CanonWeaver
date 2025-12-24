package org.canonweaver.web.dao;

import org.canonweaver.domain.Block;
import org.canonweaver.web.dto.CreateBlockRequest;
import org.canonweaver.web.dto.UpdateBlockRequest;
import org.canonweaver.web.dto.BlockResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BlockDao {

    public Block toEntity(CreateBlockRequest request) {
        if (request == null) {
            return new Block(null, null, false);
        }
        boolean isSaved = request.isSaved() != null && request.isSaved();
        return new Block(request.id(), request.content(), isSaved);
    }

    public Block toEntity(UpdateBlockRequest request) {
        return new Block(request.id(), request.content(), request.isSaved());
    }

    public BlockResponse toResponse(Block block) {
        return new BlockResponse(block.getId(), block.getContent(), block.isSaved());
    }

    public List<BlockResponse> toResponses(List<Block> blocks) {
        return blocks.stream().map(this::toResponse).toList();
    }

}
