class Solution {
    struct Node { Node* kid[2] = {}; };
public:
    int findMaximumXOR(vector<int>& nums) {
        Node* root = new Node();
        for (int x : nums) {                                // insert bits, highest first
            Node* cur = root;
            for (int b = 30; b >= 0; b--) {
                int bit = (x >> b) & 1;
                if (!cur->kid[bit]) cur->kid[bit] = new Node();
                cur = cur->kid[bit];
            }
        }
        int best = 0;
        for (int x : nums) {
            Node* cur = root;
            int xr = 0;
            for (int b = 30; b >= 0; b--) {
                int want = ((x >> b) & 1) ^ 1;              // prefer the opposite bit
                if (cur->kid[want]) { xr |= 1 << b; cur = cur->kid[want]; }
                else cur = cur->kid[want ^ 1];
            }
            best = max(best, xr);
        }
        return best;
    }
};
