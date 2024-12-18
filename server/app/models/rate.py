from dataclasses import dataclass


@dataclass
class Rate:
    rate_id: int
    call_type: str
    cost_per_minute: float
    discount_per_year: float
    max_discount: float

    def to_dict(self):
        return {
            "rate_id": self.rate_id,
            "call_type": self.call_type,
            "cost_per_minute": self.cost_per_minute,
            "discount_per_year": self.discount_per_year,
            "max_discount": self.max_discount,
        }
