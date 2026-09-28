import math

class NumArray:
    def __init__(self, nums: List[int]):
        self.a = nums[:]
        self.b = max(1, math.ceil(math.sqrt(len(nums))))   # block size ~ √n
        self.block = [0] * ((len(nums) + self.b - 1) // self.b)
        for i, x in enumerate(nums):
            self.block[i // self.b] += x

    def update(self, index: int, val: int) -> None:
        self.block[index // self.b] += val - self.a[index]
        self.a[index] = val

    def sumRange(self, left: int, right: int) -> int:
        a, b, s, i = self.a, self.b, 0, left
        while i <= right and i % b:             # loose elements on the left
            s += a[i]
            i += 1
        while i + b - 1 <= right:               # whole blocks
            s += self.block[i // b]
            i += b
        while i <= right:                       # loose elements on the right
            s += a[i]
            i += 1
        return s
