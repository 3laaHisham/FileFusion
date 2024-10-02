package net.atos.UserService.util;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import org.hibernate.id.factory.spi.StandardGenerator;
import com.github.f4b6a3.uuid.UuidCreator;

import java.io.Serializable;
import java.util.UUID;

public class UUIDv7Generator implements IdentifierGenerator, StandardGenerator {

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) {
        return UuidCreator.getTimeOrderedEpoch();
    }
}
