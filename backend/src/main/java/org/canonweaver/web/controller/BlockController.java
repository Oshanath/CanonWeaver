package org.canonweaver.web.controller;

import jakarta.validation.Valid;
import org.canonweaver.domain.Block;
import org.canonweaver.service.BlockService;
import org.canonweaver.web.dao.BlockDao;
import org.canonweaver.web.dto.BlockRequest;
import org.canonweaver.web.dto.BlockResponse;
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
    public List<BlockResponse> listBlocks() {
        return blockDao.toResponses(blockService.findAll());
    }

    @PostMapping
    public ResponseEntity<BlockResponse> create(@Valid @RequestBody BlockRequest request) {
        Block created = blockService.create(blockDao.toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(blockDao.toResponse(created));
    }

}
