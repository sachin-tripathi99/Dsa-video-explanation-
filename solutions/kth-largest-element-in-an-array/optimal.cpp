class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        mt19937 rng(1);
        int target = nums.size() - k, lo = 0, hi = nums.size() - 1;
        while (true) {
            int pivot = nums[lo + rng() % (hi - lo + 1)];
            int lt = lo, i = lo, gt = hi;                         // three-way partition
            while (i <= gt) {
                if (nums[i] < pivot) swap(nums[lt++], nums[i++]);
                else if (nums[i] > pivot) swap(nums[i], nums[gt--]);
                else i++;
            }
            if (target < lt) hi = lt - 1;                         // answer is on the left
            else if (target > gt) lo = gt + 1;                    // answer is on the right
            else return pivot;                                    // target is among the pivots
        }
    }
};
