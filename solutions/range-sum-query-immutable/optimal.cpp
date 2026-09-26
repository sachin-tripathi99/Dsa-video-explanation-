class NumArray {
    vector<int> P;                            // P[i] = sum of the first i elements
public:
    NumArray(vector<int>& nums) : P(nums.size() + 1, 0) {
        for (size_t i = 0; i < nums.size(); i++) P[i + 1] = P[i] + nums[i];
    }

    int sumRange(int left, int right) {
        return P[right + 1] - P[left];
    }
};
