class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        x = int("".join(map(str, digits))) + 1   # Python ints never overflow; Java/C++ would
        return [int(c) for c in str(x)]
