class Solution:
    def canConstruct(self, ransomNote: str, magazine: str) -> bool:
        letters = list(magazine)
        for c in ransomNote:
            if c not in letters:                     # scan the magazine
                return False
            letters.remove(c)                        # use it up
        return True
