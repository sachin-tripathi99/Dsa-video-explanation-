class Solution {
public:
    int minStoneSum(vector<int>& piles, int k) {
        priority_queue<int> heap(piles.begin(), piles.end());
        int total = accumulate(piles.begin(), piles.end(), 0);
        while (k-- > 0) {
            int x = heap.top(); heap.pop();
            total -= x / 2;
            heap.push(x - x / 2);
        }
        return total;
    }
};
