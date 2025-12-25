package org.canonweaver.service;

import org.canonweaver.domain.Block;
import org.canonweaver.repository.BlockRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlockService {

    private final BlockRepository blockRepository;

    public BlockService(BlockRepository blockRepository) {
        this.blockRepository = blockRepository;
    }

    public Block create(Block block) {
        return blockRepository.save(block);
    }

    public Block update(Block block) {
        return blockRepository.save(block);
    }

    public List<Block> findAll() {
        return blockRepository.findAll();
    }

    public void deleteById(Long id) {
        blockRepository.deleteById(id);
    }

}
