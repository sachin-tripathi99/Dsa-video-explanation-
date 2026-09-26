from functools import lru_cache

class Solution:
    def checkValidString(self, s: str) -> bool:
        @lru_cache(maxsize=None)
        def go(i, open_):
            if open_ < 0 or open_ > len(s) - i:  # cannot close that many
                return False
            if i == len(s):
                return open_ == 0
            if s[i] == "(":
                return go(i + 1, open_ + 1)
            if s[i] == ")":
                return go(i + 1, open_ - 1)
            return go(i + 1, open_ + 1) or go(i + 1, open_ - 1) or go(i + 1, open_)

        return go(0, 0)
