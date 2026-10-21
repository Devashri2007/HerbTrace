// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HerbTrace
 * @dev Botanical Traceability System for Ayurvedic Herbs
 * Immutable on-chain verification of herb provenance, quality inspection,
 * processing timeline, evidence hashes, and formulation creation.
 */
contract HerbTrace {
    address public admin;

    enum BatchStatus {
        REGISTERED,
        SUBMITTED,
        QUALITY_PENDING,
        APPROVED,
        PROCESSING,
        FORMULATION_USED,
        TRACEABLE,
        REJECTED
    }

    struct BatchRecord {
        string batchId;
        string botanicalHash;      // Hash of botanical name, part, species
        uint256 collectionTimestamp;
        string locationHash;       // Lat/Lng and region hash
        string evidenceHash;       // SHA-256 of initial collection evidence
        BatchStatus status;
        address registeredBy;
        uint256 blockTimestamp;
        bool exists;
    }

    struct QualityRecord {
        string batchId;
        bool approved;
        string inspectorNotes;
        string qualityParametersHash;
        address inspector;
        uint256 timestamp;
    }

    struct ProcessingRecord {
        string batchId;
        string stage;             // Cleaning, Sorting, Drying, Grinding, Extraction, Storage, Packaging
        string method;
        uint256 quantityAfter;
        string evidenceHash;
        address processor;
        uint256 timestamp;
    }

    struct FormulationRecord {
        string productId;
        string formulationId;
        string[] ingredientBatchIds;
        string metadataHash;      // Formulation details hash
        address manufacturer;
        uint256 timestamp;
        bool exists;
    }

    struct EvidenceRecord {
        string evidenceId;
        string sha256Hash;
        uint256 timestamp;
        address uploadedBy;
    }

    // Storage mappings
    mapping(string => BatchRecord) public batches;
    mapping(string => QualityRecord) public qualityRecords;
    mapping(string => ProcessingRecord[]) private batchProcessingHistory;
    mapping(string => EvidenceRecord[]) private batchEvidenceHistory;
    mapping(string => FormulationRecord) public formulations;
    mapping(string => string) public productToFormulation;

    string[] public allBatchIds;
    string[] public allProductIds;

    // Events
    event BatchRegistered(
        string indexed batchId,
        string botanicalHash,
        address indexed registeredBy,
        uint256 timestamp
    );
    event BatchStatusUpdated(string indexed batchId, BatchStatus status, address updatedBy);
    event BatchApproved(string indexed batchId, address indexed inspector, uint256 timestamp);
    event BatchRejected(string indexed batchId, string reason, address indexed inspector, uint256 timestamp);
    event ProcessingAdded(string indexed batchId, string stage, address indexed processor, uint256 timestamp);
    event EvidenceLocked(string indexed batchId, string evidenceId, string sha256Hash, uint256 timestamp);
    event FormulationCreated(string indexed productId, string indexed formulationId, address indexed manufacturer, uint256 timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "HerbTrace: Only admin can perform this operation");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @notice Register a newly collected herb batch on the blockchain
     */
    function registerBatch(
        string memory _batchId,
        string memory _botanicalHash,
        uint256 _collectionTimestamp,
        string memory _locationHash,
        string memory _evidenceHash
    ) external {
        require(!batches[_batchId].exists, "HerbTrace: Batch already exists");
        require(bytes(_batchId).length > 0, "HerbTrace: Invalid batch ID");

        batches[_batchId] = BatchRecord({
            batchId: _batchId,
            botanicalHash: _botanicalHash,
            collectionTimestamp: _collectionTimestamp,
            locationHash: _locationHash,
            evidenceHash: _evidenceHash,
            status: BatchStatus.REGISTERED,
            registeredBy: msg.sender,
            blockTimestamp: block.timestamp,
            exists: true
        });

        allBatchIds.push(_batchId);

        if (bytes(_evidenceHash).length > 0) {
            batchEvidenceHistory[_batchId].push(EvidenceRecord({
                evidenceId: "EV-INIT",
                sha256Hash: _evidenceHash,
                timestamp: block.timestamp,
                uploadedBy: msg.sender
            }));
            emit EvidenceLocked(_batchId, "EV-INIT", _evidenceHash, block.timestamp);
        }

        emit BatchRegistered(_batchId, _botanicalHash, msg.sender, block.timestamp);
    }

    /**
     * @notice Update batch status
     */
    function updateBatchStatus(string memory _batchId, BatchStatus _newStatus) external {
        require(batches[_batchId].exists, "HerbTrace: Batch does not exist");
        batches[_batchId].status = _newStatus;
        emit BatchStatusUpdated(_batchId, _newStatus, msg.sender);
    }

    /**
     * @notice Record Quality Inspector Approval
     */
    function approveBatch(
        string memory _batchId,
        string memory _inspectorNotes,
        string memory _qualityHash
    ) external {
        require(batches[_batchId].exists, "HerbTrace: Batch does not exist");

        batches[_batchId].status = BatchStatus.APPROVED;
        qualityRecords[_batchId] = QualityRecord({
            batchId: _batchId,
            approved: true,
            inspectorNotes: _inspectorNotes,
            qualityParametersHash: _qualityHash,
            inspector: msg.sender,
            timestamp: block.timestamp
        });

        emit BatchApproved(_batchId, msg.sender, block.timestamp);
    }

    /**
     * @notice Record Quality Inspector Rejection
     */
    function rejectBatch(
        string memory _batchId,
        string memory _rejectionReason
    ) external {
        require(batches[_batchId].exists, "HerbTrace: Batch does not exist");

        batches[_batchId].status = BatchStatus.REJECTED;
        qualityRecords[_batchId] = QualityRecord({
            batchId: _batchId,
            approved: false,
            inspectorNotes: _rejectionReason,
            qualityParametersHash: "",
            inspector: msg.sender,
            timestamp: block.timestamp
        });

        emit BatchRejected(_batchId, _rejectionReason, msg.sender, block.timestamp);
    }

    /**
     * @notice Add chronological processing stage event
     */
    function addProcessingEvent(
        string memory _batchId,
        string memory _stage,
        string memory _method,
        uint256 _quantityAfter,
        string memory _evidenceHash
    ) external {
        require(batches[_batchId].exists, "HerbTrace: Batch does not exist");
        require(
            batches[_batchId].status == BatchStatus.APPROVED ||
            batches[_batchId].status == BatchStatus.PROCESSING,
            "HerbTrace: Batch must be approved to enter processing"
        );

        batches[_batchId].status = BatchStatus.PROCESSING;

        batchProcessingHistory[_batchId].push(ProcessingRecord({
            batchId: _batchId,
            stage: _stage,
            method: _method,
            quantityAfter: _quantityAfter,
            evidenceHash: _evidenceHash,
            processor: msg.sender,
            timestamp: block.timestamp
        }));

        emit ProcessingAdded(_batchId, _stage, msg.sender, block.timestamp);
    }

    /**
     * @notice Lock new evidence hash for a batch
     */
    function addEvidenceHash(
        string memory _batchId,
        string memory _evidenceId,
        string memory _sha256Hash
    ) external {
        require(batches[_batchId].exists, "HerbTrace: Batch does not exist");

        batchEvidenceHistory[_batchId].push(EvidenceRecord({
            evidenceId: _evidenceId,
            sha256Hash: _sha256Hash,
            timestamp: block.timestamp,
            uploadedBy: msg.sender
        }));

        emit EvidenceLocked(_batchId, _evidenceId, _sha256Hash, block.timestamp);
    }

    /**
     * @notice Manufacturer binds one or more herb batches to a consumer product formulation
     */
    function createFormulation(
        string memory _productId,
        string memory _formulationId,
        string[] memory _ingredientBatchIds,
        string memory _metadataHash
    ) external {
        require(!formulations[_productId].exists, "HerbTrace: Product formulation already exists");
        require(_ingredientBatchIds.length > 0, "HerbTrace: At least one batch required");

        // Verify all referenced batches exist
        for (uint256 i = 0; i < _ingredientBatchIds.length; i++) {
            require(batches[_ingredientBatchIds[i]].exists, "HerbTrace: Ingredient batch missing");
            batches[_ingredientBatchIds[i]].status = BatchStatus.FORMULATION_USED;
        }

        formulations[_productId] = FormulationRecord({
            productId: _productId,
            formulationId: _formulationId,
            ingredientBatchIds: _ingredientBatchIds,
            metadataHash: _metadataHash,
            manufacturer: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        productToFormulation[_productId] = _formulationId;
        allProductIds.push(_productId);

        emit FormulationCreated(_productId, _formulationId, msg.sender, block.timestamp);
    }

    /**
     * @notice Verify batch status and on-chain identity
     */
    function verifyBatch(string memory _batchId) external view returns (
        bool exists,
        string memory botanicalHash,
        uint256 collectionTimestamp,
        string memory locationHash,
        BatchStatus status,
        address registeredBy,
        uint256 blockTimestamp
    ) {
        BatchRecord memory b = batches[_batchId];
        return (
            b.exists,
            b.botanicalHash,
            b.collectionTimestamp,
            b.locationHash,
            b.status,
            b.registeredBy,
            b.blockTimestamp
        );
    }

    /**
     * @notice Retrieve batch processing history length and items
     */
    function getProcessingHistory(string memory _batchId) external view returns (ProcessingRecord[] memory) {
        return batchProcessingHistory[_batchId];
    }

    /**
     * @notice Retrieve batch evidence records
     */
    function getEvidenceHistory(string memory _batchId) external view returns (EvidenceRecord[] memory) {
        return batchEvidenceHistory[_batchId];
    }

    /**
     * @notice Get formulation for a product ID
     */
    function getProductFormulation(string memory _productId) external view returns (
        string memory formulationId,
        string[] memory ingredientBatchIds,
        string memory metadataHash,
        address manufacturer,
        uint256 timestamp
    ) {
        FormulationRecord memory f = formulations[_productId];
        require(f.exists, "HerbTrace: Product not found");
        return (
            f.formulationId,
            f.ingredientBatchIds,
            f.metadataHash,
            f.manufacturer,
            f.timestamp
        );
    }

    /**
     * @notice Total registered batches
     */
    function getTotalBatches() external view returns (uint256) {
        return allBatchIds.length;
    }

    /**
     * @notice Total formulations/products
     */
    function getTotalProducts() external view returns (uint256) {
        return allProductIds.length;
    }
}
