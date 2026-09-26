class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        vector<int> keep;
        for (int x : nums)
            if (keep.empty() || keep.back() != x) keep.push_back(x);
        copy(keep.begin(), keep.end(), nums.begin());
        return keep.size();
    }
};
