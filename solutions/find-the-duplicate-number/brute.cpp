class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        for (int x : nums) if (!seen.insert(x).second) return x;
        return -1;
    }
};
