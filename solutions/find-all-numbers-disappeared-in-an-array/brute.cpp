class Solution {
public:
    vector<int> findDisappearedNumbers(vector<int>& nums) {
        unordered_set<int> seen(nums.begin(), nums.end());
        vector<int> out;
        for (int x = 1; x <= (int)nums.size(); x++) if (!seen.count(x)) out.push_back(x);
        return out;
    }
};
