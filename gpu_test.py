import torch
import time

device = "cuda"

print("Using:", torch.cuda.get_device_name(0))

x = torch.rand(10000, 10000).to(device)
y = torch.rand(10000, 10000).to(device)

print("Starting GPU computation...")

start = time.time()

for i in range(100):
    z = torch.matmul(x, y)

torch.cuda.synchronize()

print("Completed in:", time.time() - start, "seconds")