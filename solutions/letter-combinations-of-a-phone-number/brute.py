class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        keys = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl", "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
        if not digits:
            return []
        cur = [""]
        for d in digits:
            cur = [p + ch for p in cur for ch in keys[d]]
        return cur
