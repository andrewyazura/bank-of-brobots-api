from enum import Enum, auto


class UserStatus(Enum):
    Active = auto()
    Restricted = auto()


class TransactionStatus(Enum):
    Done = auto()
    Rejected = auto()
    WaitingConfirmation = auto()


class ExternalApplicationStatus(Enum):
    Active = auto()
    Deleted = auto()
    Restricted = auto()
