class Solution {
public:
    bool findTarget(TreeNode* root, int k) {
        stack<TreeNode*> lo, hi;
        for (TreeNode* n = root; n; n = n->left) lo.push(n);      // smallest on top
        for (TreeNode* n = root; n; n = n->right) hi.push(n);     // largest on top
        while (!lo.empty() && !hi.empty() && lo.top() != hi.top()) {
            int s = lo.top()->val + hi.top()->val;
            if (s == k) return true;
            if (s < k) {                                    // next smallest
                TreeNode* n = lo.top(); lo.pop();
                for (n = n->right; n; n = n->left) lo.push(n);
            } else {                                        // next largest
                TreeNode* n = hi.top(); hi.pop();
                for (n = n->left; n; n = n->right) hi.push(n);
            }
        }
        return false;
    }
};
