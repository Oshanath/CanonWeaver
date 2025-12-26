package org.canonweaver.web.controller;

import jakarta.validation.Valid;
import org.canonweaver.domain.Block;
import org.canonweaver.service.BlockService;
import org.canonweaver.web.dao.BlockDao;
import org.canonweaver.web.dto.CreateBlockRequest;
import org.canonweaver.web.dto.BlockResponse;
import org.canonweaver.web.dto.UpdateBlockRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/blocks")
public class BlockController {

    private final BlockService blockService;
    private final BlockDao blockDao;

    public BlockController(BlockService blockService, BlockDao blockDao) {
        this.blockService = blockService;
        this.blockDao = blockDao;
    }

    @GetMapping
    public List<BlockResponse> listBlocks(@RequestParam(required = false) Long sceneId) {
        if (sceneId == null) {
            return blockDao.toResponses(blockService.findAll());
        }
        return blockDao.toResponses(blockService.findAllBySceneId(sceneId));
    }

    @PostMapping
    public ResponseEntity<BlockResponse> create(@Valid @RequestBody CreateBlockRequest request) {
        Block created = blockService.create(blockDao.toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(blockDao.toResponse(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlockResponse> update(@PathVariable Long id, @Valid @RequestBody UpdateBlockRequest request) {
        Block toUpdate = blockDao.toEntity(request);
        toUpdate.setId(id);
        Block updated = blockService.update(toUpdate);
        return ResponseEntity.ok(blockDao.toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        blockService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
