class Solution:
    def isValid(self, s: str) -> bool:
        prev = None
        while s != prev:
            prev = s
            s = s.replace("()", "").replace("[]", "").replace("{}", "")   # delete matched pairs
        return s == ""
