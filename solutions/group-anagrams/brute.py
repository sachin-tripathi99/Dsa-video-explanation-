class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups, keys = [], []                   # keys[g] = sorted form of group g
        for w in strs:
            s = sorted(w)
            for g, k in enumerate(keys):        # compare with every existing group
                if k == s:
                    groups[g].append(w)
                    break
            else:
                keys.append(s)
                groups.append([w])
        return groups
