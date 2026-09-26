class Solution {
public:
    vector<int> findDuplicates(vector<int>& nums) {
        unordered_set<int> seen;
        vector<int> out;
        for (int x : nums) if (!seen.insert(x).second) out.push_back(x);
        return out;
    }
};
