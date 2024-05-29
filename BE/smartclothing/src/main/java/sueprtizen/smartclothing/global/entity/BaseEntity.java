package sueprtizen.smartclothing.global.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 공통 엔티티 베이스 클래스입니다.
 * 이 클래스는 모든 엔티티의 공통적인 속성인 생성 시간과 수정 시간을 자동으로 관리합니다.
 * {@link AuditingEntityListener}를 사용하여 엔티티의 생명주기 이벤트를 감지하고,
 * 엔티티가 생성되거나 수정될 때 현재 시간을 자동으로 설정합니다.
 * <p>
 * {@link MappedSuperclass} 어노테이션은 이 클래스가 엔티티 클래스에 의해 상속될 것임을 나타냅니다.
 * 이 클래스 자체는 데이터베이스 테이블과 직접 매핑되지 않지만, 상속받는 자식 클래스에서는
 * 이 클래스의 매핑 정보를 상속받아 사용할 수 있습니다.
 * <p>
 * {@link EntityListeners} 어노테이션은 엔티티의 생명주기 이벤트를 처리하기 위해
 * 사용될 리스너 클래스를 지정합니다. 여기서는 {@link AuditingEntityListener}를 사용하여
 * 생성 시간과 수정 시간을 자동으로 관리합니다.
 */
@Getter
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
public abstract class BaseEntity {

    /**
     * 엔티티 생성 시간입니다.
     * 'created_at' 컬럼에 매핑되며, MySQL의 TIMESTAMP 타입으로 지정됩니다.
     * {@link CreatedDate} 어노테이션을 통해, 엔티티가 처음 저장될 때 현재 시간으로 자동 설정됩니다.
     * 'updatable = false' 옵션으로, 한 번 설정된 후에는 이 필드의 값이 업데이트되지 않습니다.
     * 'nullable = false'로 설정되어 있어, 이 필드는 항상 값을 가지며 NULL이 될 수 없습니다.
     * 'columnDefinition'을 사용하여 이 필드가 데이터베이스에 생성될 때 사용할 컬럼 정의를 직접 지정합니다.
     * "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"는 MySQL에서 이 컬럼이 TIMESTAMP 타입이며,
     * 기본값으로 현재 시간을 사용하도록 설정합니다.
     */
    @CreatedDate
    @Column(updatable = false, nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    /**
     * 엔티티 최종 수정 시간입니다.
     * 'updated_at' 컬럼에 매핑되며, MySQL의 TIMESTAMP 타입으로 지정됩니다.
     * {@link LastModifiedDate} 어노테이션을 통해, 엔티티가 수정될 때 현재 시간으로 자동 설정됩니다.
     * 'nullable = false'로 설정되어 있어, 이 필드는 항상 값을 가지며 NULL이 될 수 없습니다.
     * 'columnDefinition'을 사용하여 이 필드가 데이터베이스에 생성될 때 사용할 컬럼 정의를 직접 지정합니다.
     * "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"는 MySQL에서 이 컬럼이
     * TIMESTAMP 타입이며, 생성될 때와 업데이트될 때 현재 시간을 기본값으로 사용하도록 설정합니다.
     */
    @LastModifiedDate
    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;
}
