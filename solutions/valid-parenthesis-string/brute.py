class Solution:
    def checkValidString(self, s: str) -> bool:
        def go(i, open_):
            if open_ < 0:
                return False
            if i == len(s):
                return open_ == 0
            if s[i] == "(":
                return go(i + 1, open_ + 1)
            if s[i] == ")":
                return go(i + 1, open_ - 1)
            return go(i + 1, open_ + 1) or go(i + 1, open_ - 1) or go(i + 1, open_)   # * as ( ) or empty

        return go(0, 0)
