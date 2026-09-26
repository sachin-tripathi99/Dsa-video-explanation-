class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        keys = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl", "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
        out, path = [], []

        def go(i):
            if i == len(digits):
                out.append("".join(path))
                return
            for ch in keys[digits[i]]:
                path.append(ch)                 # choose
                go(i + 1)                       # explore
                path.pop()                      # un-choose

        if digits:
            go(0)
        return out
