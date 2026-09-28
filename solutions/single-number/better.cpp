class Solution {
public:
    int singleNumber(vector<int>& nums) {
        unordered_set<int> seen;
        for (int x : nums) if (!seen.erase(x)) seen.insert(x);   // pairs cancel
        return *seen.begin();
    }
};
