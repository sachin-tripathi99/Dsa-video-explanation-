from functools import cmp_to_key

class Solution:
    def largestNumber(self, nums: List[int]) -> str:
        s = list(map(str, nums))

        def cmp(a: str, b: str) -> int:
            if a + b > b + a:
                return -1                  # a first
            if a + b < b + a:
                return 1
            return 0

        s.sort(key=cmp_to_key(cmp))
        return "0" if s[0] == "0" else "".join(s)
