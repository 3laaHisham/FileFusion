package net.atos.WorkspaceService.repository;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.support.SimpleMongoRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;
import java.util.List;

@NoRepositoryBean
public interface MyMongoRepository<T, ID extends Serializable> extends MongoRepository<T, ID> {

    public <S extends T> Slice<S> findAllNoCount(Example<S> example, Pageable pageable);
}
