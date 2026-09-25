from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = defaultdict(list)
        for w in strs:
            count = [0] * 26
            for c in w:
                count[ord(c) - 97] += 1
            groups[tuple(count)].append(w)        # tuples are hashable
        return list(groups.values())
