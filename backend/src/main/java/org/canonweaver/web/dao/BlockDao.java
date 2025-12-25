package org.canonweaver.web.dao;

import org.canonweaver.domain.Block;
import org.canonweaver.web.dto.CreateBlockRequest;
import org.canonweaver.web.dto.UpdateBlockRequest;
import org.canonweaver.web.dto.BlockResponse;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class BlockDao {

    public Block toEntity(CreateBlockRequest request) {
        if (request == null) {
            return new Block(null, null, false);
        }
        boolean isLocked = request.isLocked() != null && request.isLocked();
        return new Block(request.id(), request.content(), isLocked);
    }

    public Block toEntity(UpdateBlockRequest request) {
        return new Block(request.id(), request.content(), request.isLocked());
    }

    public BlockResponse toResponse(Block block) {
        return new BlockResponse(block.getId(), block.getContent(), block.isLocked());
    }

    public List<BlockResponse> toResponses(List<Block> blocks) {
        return blocks.stream().map(this::toResponse).toList();
    }

    public Map<Long, BlockResponse> toResponseMap(List<Block> blocks) {
        return blocks.stream()
                .map(this::toResponse)
                .collect(Collectors.toMap(
                        BlockResponse::id,
                        response -> response,
                        (existing, replacement) -> replacement,
                        LinkedHashMap::new
                ));
    }

}
