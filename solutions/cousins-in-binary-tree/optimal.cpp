class Solution {
public:
    bool isCousins(TreeNode* root, int x, int y) {
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            bool hasX = false, hasY = false;
            for (int i = q.size(); i > 0; i--) {
                TreeNode* n = q.front(); q.pop();
                if (n->val == x) hasX = true;
                if (n->val == y) hasY = true;
                if (n->left && n->right) {                  // siblings are not cousins
                    int a = n->left->val, b = n->right->val;
                    if ((a == x && b == y) || (a == y && b == x)) return false;
                }
                if (n->left) q.push(n->left);
                if (n->right) q.push(n->right);
            }
            if (hasX && hasY) return true;
            if (hasX || hasY) return false;                 // different depths
        }
        return false;
    }
};
