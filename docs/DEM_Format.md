
# GoldSource (.dem) file format!

### Header
这些文件用于在基于 GoldSource 引擎的游戏中重放游戏中的事件，它们以一个头部开始。
```cpp
struct DemoHeader {
	int32_t netProtocol;
	int32_t demoProtocol;
	std::string mapName;
	std::string gameDir;
	int32_t mapCRC;
	int32_t directoryOffset;
};
```

读取完这个头部后，你需要从文件开头偏移到`DemoHeader.directoryOffset`的位置。然后读取一个`int32`类型的`entrycount`，它表示文件中目录项（用于存储帧）的数量。完成此操作后，你可以开始解析目录项。

对于每个目录项，都有一个头部：

```cpp
struct DemoDirectoryEntry {
	int32_t type;
	std::string description;
	int32_t flags;
	int32_t CDTrack;
	float trackTime;
	int32_t frameCount;
	int32_t offset;
	int32_t fileLength;
};
```
读取完目录项头部后，你可以读取帧。首先从文件开头偏移到`DemoDirectoryEntry.offset`的位置，然后就可以开始读取帧。

每个帧都有一个头部，它决定了如何读取该帧。目录项的最后一帧应该是`NEXT_SECTION`类型，所以你应该一直读取直到遇到这种类型的帧，然后以相同的方式开始读取下一个目录项。

### Frames

Frameheader:
```cpp
struct DemoFrame {
	DemoFrameType type;
	float time;
	int32_t frame;
};
```
读取完这个头部后，根据`DemoFrame.type`的值，你可以读取实际的帧内容。
```cpp
enum class DemoFrameType : uint8_t {
	DEMO_START = 2,
	CONSOLE_COMMAND = 3,
	CLIENT_DATA = 4,
	NEXT_SECTION = 5,
	EVENT = 6,
	WEAPON_ANIM = 7,
	SOUND = 8,
	DEMO_BUFFER = 9
};
```
#### DEMO_START Frame

此帧没有额外数据。

#### CONSOLE_COMMAND Frame

```cpp
struct ConsoleCommandFrame : DemoFrame {
	std::string command;
};
```

#### CLIENT_DATA Frame

```cpp
struct ClientDataFrame : DemoFrame {
	float origin[3];
	float viewangles[3];
	int32_t weaponBits;
	float fov;
};
```

#### NEXT_SECTION Frame

此帧没有额外数据，你可能已经到达整个演示的末尾（检查目录项的数量）或者当前目录项的末尾。

#### EVENT Frame

```cpp
struct EventFrame : DemoFrame {
	int32_t flags;
	int32_t index;
	float delay;
	struct {
		int32_t flags;
		int32_t entityIndex;
		float origin[3];
		float angles[3];
		float velocity[3];
		int32_t ducking;
		float fparam1;
		float fparam2;
		int32_t iparam1;
		int32_t iparam2;
		int32_t bparam1;
		int32_t bparam2;
	} EventArgs;
};
```
#### WEAPON_ANIM Frame

```cpp
struct WeaponAnimFrame : DemoFrame {
	int32_t anim;
	int32_t body;
};
```

#### SOUND Frame

```cpp
struct SoundFrame : DemoFrame {
	int32_t channel;
	std::vector<char> sample;
	float attenuation;
	float volume;
	int32_t flags;
	int32_t pitch;
};
```

#### DEMO_BUFFER Frame

```cpp
struct DemoBufferFrame : DemoFrame {
	std::vector<unsigned char> buffer;
};
```

### NetMessage Frame

否则，如果您读取不在枚举中的任何内容，您将遇到一个netmessage帧。
像这样阅读：

```cpp
struct NetMsgFrame : DemoFrame {
	struct {
		float timestamp;

		struct {
			float vieworg[3];
			float viewangles[3];
			float forward[3];
			float right[3];
			float up[3];
			float frametime;
			float time;
			int32_t intermission;
			int32_t paused;
			int32_t spectator;
			int32_t onground;
			int32_t waterlevel;
			float simvel[3];
			float simorg[3];
			float viewheight[3];
			float idealpitch;
			float cl_viewangles[3];
			int32_t health;
			float crosshairangle[3];
			float viewsize;
			float punchangle[3];
			int32_t maxclients;
			int32_t viewentity;
			int32_t playernum;
			int32_t max_entities;
			int32_t demoplayback;
			int32_t hardware;
			int32_t smoothing;
			int32_t ptr_cmd;
			int32_t ptr_movevars;
			int32_t viewport[4];
			int32_t nextView;
			int32_t onlyClientDraw;
		} RefParams;

		struct {
			int16_t lerp_msec;
			uint8_t msec;
			uint8_t align_1;
			float viewangles[3];
			float forwardmove;
			float sidemove;
			float upmove;
			int8_t lightlevel;
			uint8_t align_2;
			uint16_t buttons;
			int8_t impulse;
			int8_t weaponselect;
			uint8_t align_3;
			uint8_t align_4;
			int32_t impact_index;
			float impact_position[3];
		} UserCmd;

		struct {
			float gravity;
			float stopspeed;
			float maxspeed;
			float spectatormaxspeed;
			float accelerate;
			float airaccelerate;
			float wateraccelerate;
			float friction;
			float edgefriction;
			float waterfriction;
			float entgravity;
			float bounce;
			float stepsize;
			float maxvelocity;
			float zmax;
			float waveHeight;
			int32_t footsteps;
			std::string skyName;
			float rollangle;
			float rollspeed;
			float skycolor_r;
			float skycolor_g;
			float skycolor_b;
			float skyvec_x;
			float skyvec_y;
			float skyvec_z;
		} MoveVars;

		float view[3];
		int32_t viewmodel;
	} DemoInfo;

	int32_t incoming_sequence;
	int32_t incoming_acknowledged;
	int32_t incoming_reliable_acknowledged;
	int32_t incoming_reliable_sequence;
	int32_t outgoing_sequence;
	int32_t reliable_sequence;
	int32_t last_reliable_sequence;

	std::vector<unsigned char> msg;
};
```

That's basically it.

