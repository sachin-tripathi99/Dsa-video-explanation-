class NumArray:
    def __init__(self, nums: List[int]):
        self.a = nums[:]

    def update(self, index: int, val: int) -> None:
        self.a[index] = val

    def sumRange(self, left: int, right: int) -> int:
        return sum(self.a[left:right + 1])      # walk the whole range
