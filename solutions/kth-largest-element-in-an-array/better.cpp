class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int, vector<int>, greater<int>> heap;    // min-heap of the k largest
        for (int x : nums) {
            heap.push(x);
            if ((int)heap.size() > k) heap.pop();               // drop the smallest
        }
        return heap.top();
    }
};
