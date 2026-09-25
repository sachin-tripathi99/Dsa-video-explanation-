class Solution:
    def canConstruct(self, ransomNote: str, magazine: str) -> bool:
        count = [0] * 26
        for c in magazine:
            count[ord(c) - 97] += 1
        for c in ransomNote:
            count[ord(c) - 97] -= 1
            if count[ord(c) - 97] < 0:               # ran out of this letter
                return False
        return True
