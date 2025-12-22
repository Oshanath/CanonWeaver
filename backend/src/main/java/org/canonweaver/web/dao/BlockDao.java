package org.canonweaver.web.dao;

import org.canonweaver.domain.Block;
import org.canonweaver.web.dto.BlockRequest;
import org.canonweaver.web.dto.BlockResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BlockDao {

    public Block toEntity(BlockRequest request) {
        return new Block(null, request.content());
    }

    public BlockResponse toResponse(Block block) {
        return new BlockResponse(block.getId(), block.getContent());
    }

    public List<BlockResponse> toResponses(List<Block> blocks) {
        return blocks.stream().map(this::toResponse).toList();
    }

}
