package net.atos.WorkspaceService.repository;

import com.mongodb.ReadPreference;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.repository.query.MongoEntityInformation;
import org.springframework.data.mongodb.repository.support.CrudMethodMetadata;
import org.springframework.data.mongodb.repository.support.SimpleMongoRepository;
import org.springframework.lang.Nullable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

public class MyMongoRepositoryImpl<T, ID extends Serializable>
        extends SimpleMongoRepository<T, ID> implements MyMongoRepository<T, ID> {

    private final MongoEntityInformation<T, ID> entityInformation;
    private final MongoOperations mongoOperations;
    @Nullable
    private CrudMethodMetadata crudMethodMetadata;

    public MyMongoRepositoryImpl(MongoEntityInformation<T, ID> metadata, MongoOperations mongoOperations) {
        super(metadata, mongoOperations);

        this.entityInformation = metadata;
        this.mongoOperations = mongoOperations;
    }

    void setRepositoryMethodMetadata(CrudMethodMetadata crudMethodMetadata) {
        this.crudMethodMetadata = crudMethodMetadata;
    }

    // REMARK: In the original (Mongo|JPA)Repository, findAll does an unnecessary Count Operation. Partially negating the benefit of paging
    @Override
    @Transactional
    public <S extends T> Slice<S> findAllNoCount(Example<S> example, Pageable pageable) {
        Assert.notNull(example, "Sample must not be null");
        Assert.notNull(pageable, "Pageable must not be null");

        // Adjust the page size by adding 1 to check for next page existence
        int pageSizePlusOne = pageable.getPageSize() + 1;

        Query query = (new Query((new Criteria()).alike(example)))
                .collation(this.entityInformation.getCollation())
                .with(pageable)
                .limit(pageSizePlusOne);

        Optional<ReadPreference> var10000 = this.getReadPreference();
        var10000.ifPresent(query::withReadPreference);

        List<S> results = this.mongoOperations.find(query, example.getProbeType(), this.entityInformation.getCollectionName());

        // Check if there is a next page
        boolean hasNext = results.size() > pageable.getPageSize();

        // If more than requested, remove the last item as it was only used to check for next page
        if (hasNext)
            results.remove(pageable.getPageSize());

        // Return a Slice with the current page's content
        return new SliceImpl<>(results, pageable, hasNext);
    }

    private Optional<ReadPreference> getReadPreference() {
        return this.crudMethodMetadata == null ? Optional.empty() : this.crudMethodMetadata.getReadPreference();
    }
}
