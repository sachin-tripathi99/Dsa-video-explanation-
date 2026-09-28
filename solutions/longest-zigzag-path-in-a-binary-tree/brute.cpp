class Solution {
    int best = 0;
    int walk(TreeNode* node, bool goLeft) {
        int len = 0;
        while (true) {
            TreeNode* next = goLeft ? node->left : node->right;
            if (!next) return len;
            node = next;
            len++;
            goLeft = !goLeft;                               // switch direction
        }
    }
    void visit(TreeNode* node) {                            // start a walk at every node
        if (!node) return;
        best = max(best, max(walk(node, true), walk(node, false)));
        visit(node->left);
        visit(node->right);
    }
public:
    int longestZigZag(TreeNode* root) {
        visit(root);
        return best;
    }
};
